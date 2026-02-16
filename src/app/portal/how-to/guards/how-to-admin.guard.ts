import { inject } from "@angular/core"
import { Router, CanActivateFn } from "@angular/router"
import { RolesEnum } from "@app/shared/enums/roles.enum";
import { AuthService } from "@app/shared/services/auth.service"
import { map, take, tap } from "rxjs";

export const HowToAdminGuard: CanActivateFn = (_router, state) => {
    const _authService = inject(AuthService);
    const router = inject(Router);

    return _authService.auth$.pipe(
        take(1),
        map(auth => auth?.user.role === RolesEnum.ADMIN),
        tap(isAdmin => {
            if (!isAdmin) {
                router.navigate(['/portal/how-to/help']);
            }
        })
    );
};