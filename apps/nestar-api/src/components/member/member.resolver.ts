import { Mutation, Resolver, Query, Args } from '@nestjs/graphql';
import { MemberService } from './member.service';
import { InternalServerErrorException } from '@nestjs/common';
import { LoginInput, MemberInput } from '../../libs/dto/member/member.input';
import { Member } from '../../libs/dto/member/member';

@Resolver()
/*
    - MemberServiceni chaqirishdan maqsad: MemberResolverning ixtiyoriy query ida ishlatishimiz mumkin
    - Query[GET] & mutation[REST API] mantiqlarini hosil qilamiz
    - @Mutation(() => Member): Mutation bizga Member[dto[member.ts]] ni qaytaradi
*/
export class MemberResolver {
    constructor( private readonly memberService: MemberService) {}
    
    // >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>Signup
    @Mutation(() => Member)
    public async signup(@Args("input") input: MemberInput): Promise<Member> {
        console.log("Mutation: signup");
        return this.memberService.signup(input);
    } 
    // <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
// Authenticated
    // >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>Login
    @Mutation(() => Member)
    public async login(@Args('input') input: LoginInput): Promise<Member> {
        console.log("Mutation: login");
        return this.memberService.login(input);
    }
    // <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<

    // >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>UpdateMember
    @Mutation(() => String)
    public async updateMember(): Promise<string> {
        console.log("Mutation: updateMember");
        return this.memberService.updateMember();
    }
    // <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<

    // >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>GetMember
    @Query(() => String)
    public async getMember(): Promise<string> {
        console.log("Query: getMember");
        return this.memberService.getMember();
    }
    // <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<

    /** ADMIN */
    // Authorization: ADMIN
    @Mutation(() => String)
    public async getAllMembersByAdmin(): Promise<string> {
        console.log('Mutation: getAllMembersByAdmin');
        return this.memberService.getAllMembersByAdmin();
    }
    // Authorization: ADMIN
    @Mutation(() => String)
    public async updateMembersByAdmin(): Promise<string> {
        console.log('Mutation: updateMembersByAdmin');
        return this.memberService.updateMembersByAdmin();
    }

}
