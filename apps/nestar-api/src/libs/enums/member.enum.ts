import { registerEnumType } from "@nestjs/graphql";

export enum MemberType{
    USER = "USER",
    AGENT = "AGENT",
    ADMIN = "ADMIN",
}
/*
[registerEnumType] - used to make your TypeScript enums accessible in your GraphQL schema. 
*/
registerEnumType(MemberType, {
    name: "MemberType",
})

export enum MemberStatus{
    ACTIVE = "ACTIVE",
    BLOCK = "BLOCK",
    DELETE = "DELETE",
}
registerEnumType(MemberStatus, {
    name: "MemberStatus",
})

export enum MemberAuthType {
    PHONE = "PHONE",
    EMAIL = "EMAIL",
    TELEGRAM = "TELEGRAM",
}
registerEnumType(MemberAuthType, {
    name: "MemberAuthType",
})