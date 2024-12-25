import { Injectable } from '@nestjs/common';

@Injectable()
export class BatchService {
  getHello(): string {
    return 'Welcome to Nestar-Batch Server!';
  }
  public async batchRollBack(): Promise<void> {
    console.log("batchRollBack");
  }
  public async batchProperties(): Promise<void> {
    console.log("batchProperties");
  }
  public async batchAgents(): Promise<void> {
    console.log("batchAgents");
  }
}


/*
import { Controller, GET } from "@nestjs/common"


@Controller()
export class AppController {



}




*/
  // "00 * * * * *" ===> har doim minut 00 yani 1minut tulishi bilan
  // "*/20 * * * * *" ===> har 20 sekundda