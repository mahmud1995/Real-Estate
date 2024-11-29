import { Mutation, Resolver, Query, Args } from '@nestjs/graphql';
import { MemberService } from './member.service';
import { InternalServerErrorException, UsePipes, ValidationPipe } from '@nestjs/common';
import { LoginInput, MemberInput } from '../../libs/dto/member/member.input';
import { Member } from '../../libs/dto/member/member';
// import { Query } from '@nestjs/common';

@Resolver()
export class MemberResolver {
    constructor( private readonly memberService: MemberService) {}
    
    // Query[GET] & mutation[REST API]
    // >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>Signup
    @Mutation(() => Member)
    // Pipe integration 1/3: method
    @UsePipes(ValidationPipe) // Pipe lar orqali teskshirish mehanizmi
    public async signup(@Args("input") input: MemberInput): Promise<Member> {
        try {
            console.log("Mutation: signup");
            console.log("input:",input)
            return this.memberService.signup(input);
        } catch(err) {
            console.log("error, Signup:", err);
            throw new InternalServerErrorException(err);
        }
    
    } 
    // <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<

    // >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>Login
    @Mutation(() => Member)
    @UsePipes(ValidationPipe)
    public async login(@Args('input') input: LoginInput): Promise<Member> {

        try {
            console.log("Mutation: login");
            return this.memberService.login(input);
        } catch(err) {
            console.log("error, Signup:", err);
            throw new InternalServerErrorException(err);
        }
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
}
