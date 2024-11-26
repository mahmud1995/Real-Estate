/*
Member module ni - Component ichida jamlemiz
Propertyga daxldor ham - Component ichida property module ni hosil qilamiz
Follow, Like, Artikl ga uhshagan mantiqlarni - Component ichida komplex jamlab boramiz
*/

import { Query, Resolver} from "@nestjs/graphql";

@Resolver() 
export class AppResolver {
    @Query(() => String)
    public sayHello(): string {
        return "GraphQL API Server";
    }
} 