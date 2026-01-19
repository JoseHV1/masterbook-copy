// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  apiUrl: 'http://localhost:3000/',
  text: 'local',
  STRIPE_PUBLIC_KEY:
    'pk_test_51Mr5saHsG1LCjqV07j8ZKZqlZdGVevqrSM66zNAjBV0RM3pI6pQWi9V2gm1h0CgmwYZJUtoVvDtfDLQ5Tq3uCO6h00ZwohoKXi',
  RECAPTCHA_SITE_KEY: '6LcIREQsAAAAAB_Wr5vEM92Z-9NdREhLI5lxSZMU',
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
