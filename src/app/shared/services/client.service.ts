import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ClientService {
  constructor() {}

  getClients() {
    return [
      {
        id: '23jsd',
        name: 'Julian Diaz',
        direction: 'Puerto Rico',
        phone: '123456342',
        email: 'julian@gmail.com',
        dateBirth: '12/09/2001',
        socialSecutiry: '120232',
        dni: '1223343',
        drivingLicense: '234353576',
      },
      {
        id: '0923',
        name: 'Pedro Perez',
        direction: 'Puerto Rico',
        phone: '09090898',
        email: 'pedro@gmail.com',
        dateBirth: '11/09/2001',
        socialSecutiry: '120232',
        dni: '1223343',
        drivingLicense: '234353576',
      },
      {
        id: '29023',
        name: 'Elnesto Pier',
        direction: 'Uruguay',
        phone: '1122342',
        email: 'elnesto@gmail.com',
        dateBirth: '12/09/1999',
        socialSecutiry: '120232',
        dni: '1223343',
        drivingLicense: '234353576',
      },
      {
        id: '1231',
        name: 'Ramon Abreu',
        direction: 'Puerto Rico',
        phone: '90238472',
        email: 'ramon@gmail.com',
        dateBirth: '12/09/2000',
        socialSecutiry: '111112',
        dni: '1111342',
        drivingLicense: '111112920',
      },
      {
        id: '29023',
        name: 'Elnesto Pier',
        direction: 'Uruguay',
        phone: '1122342',
        email: 'elnesto@gmail.com',
        dateBirth: '12/09/1999',
        socialSecutiry: '120232',
        dni: '1223343',
        drivingLicense: '234353576',
      },
      {
        id: '1231',
        name: 'Ramon Abreu',
        direction: 'Puerto Rico',
        phone: '90238472',
        email: 'ramon@gmail.com',
        dateBirth: '12/09/2000',
        socialSecutiry: '111112',
        dni: '1111342',
        drivingLicense: '111112920',
      },
    ];
  }
}
