import { PartialType } from '@nestjs/mapped-types';
import { RegisterPaymentDto } from './register-payment.dto';

export class UpdatePaymentDto extends PartialType(RegisterPaymentDto) {}
