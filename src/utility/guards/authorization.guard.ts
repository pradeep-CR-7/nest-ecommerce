import { CanActivate, ExecutionContext, Injectable, mixin, UnauthorizedException } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { Roles } from "../common/user-roles.enum";

// @Injectable()
// export class AuthorizeGuard implements CanActivate{
//     constructor(private reflector:Reflector) {}
//     canActivate(context: ExecutionContext): boolean {
//         const allowedRoles = this.reflector.get<string[]>('allowedRoles', context.getHandler());
//         const request = context.switchToHttp().getRequest();
//         const result = request?.currentUser?.roles?.map((role:string)=>allowedRoles.includes(role))
//         .find((value:boolean)=>value===true);

//         if (result) {
//         return true; // Allow access
//         }
        
//         throw new UnauthorizedException('You do not have permission to access this resource.'); 
//     }
// }

export const AuthorizeGuard = (allowedRoles:string[])=>{
    class RolesGiuardMixin implements CanActivate {
        canActivate(context: ExecutionContext): boolean {
            const request = context.switchToHttp().getRequest();
            const result = request?.currentUser?.roles?.map((role:string)=>allowedRoles.includes(role))
            .find((value:boolean)=>value===true);

            if (result) {
                return true; // Allow access
            }
            
            throw new UnauthorizedException('You do not have permission to access this resource.'); 
        }

    }
    const guard=mixin(RolesGiuardMixin);
    return guard;
}
