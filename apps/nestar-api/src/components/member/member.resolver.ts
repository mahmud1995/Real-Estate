import { Args, Mutation, Resolver, Query } from '@nestjs/graphql';
import { MemberService } from './member.service';
import { UseGuards } from '@nestjs/common';
import { AgentsInquiry, LoginInput, MemberInput, MembersInquiry } from '../../libs/dto/member/member.input';
import { Member, Members } from '../../libs/dto/member/member';
import { AuthGuard } from "../auth/guards/auth.guard";
import { AuthMember } from '../auth/decorators/authMember.decorator';
import { ObjectId } from 'mongoose';
import { Roles } from '../auth/decorators/roles.decorator';
import { MemberType } from '../../libs/enums/member.enum';
import { RolesGuard } from '../auth/guards/roles.guard';
import { MemberUpdate } from '../../libs/dto/member/member.update';
import { getSerialForImage, shapeIntoMongoObjectId, validMimeTypes } from '../../libs/config';
import { WithoutGuard } from '../auth/guards/without.guard';
import { GraphQLUpload, FileUpload } from "graphql-upload";
import { createWriteStream } from 'fs';
import { Message } from '../../libs/enums/common.enum';

/*
    - MemberServiceni chaqirishdan maqsad: MemberResolverning ixtiyoriy query ida ishlatishimiz mumkin
    - Query[GET] & mutation[REST API] mantiqlarini hosil qilamiz
    - @Mutation(() => Member): Mutation bizga Member[dto[member.ts]] ni qaytaradi
*/
@Resolver()
export class MemberResolver {
    constructor( private readonly memberService: MemberService) {}

    @Mutation(() => Member)
    public async signup(@Args("input") input: MemberInput): Promise<Member> {
        console.log("Mutation: signup");
        return await this.memberService.signup(input);
    } 

    // Authenticated: (USER, AGENT, ADMIN)
    @Mutation(() => Member)
    public async login(@Args('input') input: LoginInput): Promise<Member> {
        console.log("Mutation: login");
        return await this.memberService.login(input);
    } 

    @UseGuards(AuthGuard)
    @Query(() => String)
    public async checkAuth(@AuthMember('memberNick') memberNick: Member): Promise<string> {
        console.log('Mutation: checkAuth');
        console.log('memberNick:', memberNick);
        return `Hi ${memberNick}`;
    }

    @Roles(MemberType.USER, MemberType.AGENT)
    @UseGuards(RolesGuard)
    @Query(() => String)
    public async checkAuthRoles(@AuthMember() authMember: Member): Promise<string> {
        console.log('Query: checkAuthRoles');
        return `Hi ${authMember.memberNick}, you are ${authMember.memberType} (memberId: ${authMember._id})`;
    }

    @UseGuards(AuthGuard)
    @Mutation(() => Member)
    public async updateMember(
        @Args("input") input: MemberUpdate,
        @AuthMember('_id') memberId: ObjectId,
    ): Promise<Member> {
        console.log('Mutation: updateMember');
        delete input._id;
        return await this.memberService.updateMember(memberId, input);
    }




    @UseGuards(WithoutGuard)
    @Query(() => Member)
    public async getMember(
        @Args("memberId") input: string, 
        @AuthMember('_id') memberId: ObjectId
    ): Promise<Member> {
        console.log("Query: getMember");
        const targetId = shapeIntoMongoObjectId(input);
        return await this.memberService.getMember(memberId, targetId);
    }
    

    @UseGuards(WithoutGuard)
    @Query(() => Members)
    public async getAgents(
        @Args('input') input: AgentsInquiry, 
        @AuthMember('_id') memberId: ObjectId): Promise<Members> {
        console.log('Query: getAgents');
        return await this.memberService.getAgents(memberId, input);
    }

    @UseGuards(AuthGuard)
    @Mutation(() => Member)
    public async likeTargetMember(
        @Args('memberId') input: string,
        @AuthMember('_id') memberId: ObjectId,
    ): Promise<Member> {
        console.log("Mutation: likeTargetMember");
        const likeRefId = shapeIntoMongoObjectId(input);
        return await this.memberService.likeTargetMember(memberId, likeRefId);
    }

    /** ADMIN */
    @Roles(MemberType.ADMIN)
    @UseGuards(RolesGuard)
    @Query(() => Members)
    public async getAllMembersByAdmin(@Args('input') input: MembersInquiry): Promise<Members> {
        console.log('Query: getAllMembersByAdmin');
        return await this.memberService.getAllMembersByAdmin(input);
    }
    
    // Authorization: ADMIN
    @Roles(MemberType.ADMIN)
    @UseGuards(RolesGuard)
    @Mutation(() => Member)
    public async updateMemberByAdmin(@Args("input") input: MemberUpdate): Promise<Member> {
        console.log('Mutation: updateMembersByAdmin');
        return await this.memberService.updateMemberByAdmin(input);
    }

    /** UPLOADER **/
    @UseGuards(AuthGuard)
    @Mutation((returns) => String)
    public async imageUploader( // GraphQL based technology dan foydalanadi
        @Args({ name: 'file', type: () => GraphQLUpload }) // Argumentlardan file nomi ostida kirib kelayotgan image qabul-type-graphql upload
        { createReadStream, filename, mimetype }: FileUpload, // malumotlarni olib beryapti
        @Args('target') target: String, // target nomli argument hosil qildik=> serverga yuborilayotgan image qaysi manzilga saqlashni 
    ): Promise<string> {
        console.log("Mutation: imageUploader");
        if (!filename) throw new Error(Message.UPLOAD_FAILED); // tepada kelayotgan file nomini tekshirib == bumasa error throw
    const validMime = validMimeTypes.includes(mimetype); // config.ts da berilgan formatlardan bulsa keyingi jarayonga utkazadi
    if (!validMime) throw new Error(Message.PROVIDE_ALLOWED_FORMAT);

    const imageName = getSerialForImage(filename); // tepada hamma shartlar bajarilsa ==> rasm ucun random nom hosil qilish mantigini caqirib
    const url = `uploads/${target}/${imageName}`; // uploadsning target nomli folderiga saqlashni buyurdik
    const stream = createReadStream();

    const result = await new Promise((resolve, reject) => {
        stream
            .pipe(createWriteStream(url))
            .on('finish', async () => resolve(true))
            .on('error', () => reject(false));
    });
    if (!result) throw new Error(Message.UPLOAD_FAILED);

    return url;
    }


    @UseGuards(AuthGuard)
    @Mutation((returns) => [String])
    public async imagesUploader(
        @Args('files', { type: () => [GraphQLUpload] })
    files: Promise<FileUpload>[],
    @Args('target') target: String,
    ): Promise<string[]> {
        console.log('Mutation: imagesUploader');

        const uploadedImages = [];
        const promisedList = files.map(async (img: Promise<FileUpload>, index: number): Promise<Promise<void>> => {
            try {
                const { filename, mimetype, encoding, createReadStream } = await img;

                const validMime = validMimeTypes.includes(mimetype);
                if (!validMime) throw new Error(Message.PROVIDE_ALLOWED_FORMAT);

                const imageName = getSerialForImage(filename);
                const url = `uploads/${target}/${imageName}`;
                const stream = createReadStream();

                const result = await new Promise((resolve, reject) => {
                    stream
                        .pipe(createWriteStream(url))
                        .on('finish', () => resolve(true))
                        .on('error', () => reject(false));
                });
                if (!result) throw new Error(Message.UPLOAD_FAILED);

                uploadedImages[index] = url;
            } catch (err) {
                console.log('Error, file missing!');
            }
        });

        await Promise.all(promisedList);
        return uploadedImages;
    }



}


