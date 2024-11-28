import { Field, Int, ObjectType } from "@nestjs/graphql";
import { ObjectId } from "mongoose";
import { MemberAuthType, MemberStatus, MemberType } from "../../enums/member.enum";

// backend dan => frontendga yuboriladigan data transferring objject hosil qilamiz
@ObjectType() // abckend serverdan clientga yuborilayotgan typelar(dto)ni qurish uchun decorator
export class Member {
    @Field(() => String)
        _id: ObjectId;

    @Field(() => MemberType) // graphql ning registerEnumType orqali enum urniga ishlatish mumkin
        memberType: MemberType

    @Field(() => MemberStatus) // graphql ning registerEnumType orqali enum urniga ishlatish mumkin
        memberStatus: MemberStatus

    @Field(() => MemberAuthType)
        memberAuthType: MemberAuthType;

    @Field(() => String)
        memberPhone: string;
    
    @Field(() => String)
        memberNick: string;

        memberPassord?: string

    @Field(( ) => String, {nullable: true})
        memberFullName?:string;

    @Field(() => String)
        memberImage: string;

    @Field(() => String, {nullable: true})
        memberAddress?: string;

    @Field(() => String)
        memberDesc: string;

    @Field(() => Int)
        memberProperties: number;

    @Field(() => Int)
        memberArticles: number;

    @Field(() => Int)
        memberFollowers: number;

    @Field(() => Int)
        memberFollowings: number;

    @Field(() => Int)
        memberLikes: number;

    @Field(() => Int)
        memberViews: number;

    @Field(() => Int)
        memberComments: number;
    
    @Field(() => Int)
        memberWarnings: number;

    @Field(() => Int)
        memberBlocks: number;

    @Field(() => Int)
        memberRank: number;

    @Field(() => Date, {nullable: true})
        deletedAt?: Date; 

    @Field(() => Date)
        createdAt?: Date; 
    
    @Field(() => Date)
        updatedAt?: Date; 
}

