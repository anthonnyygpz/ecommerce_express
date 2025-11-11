import { ValidationError } from "express-validator";
import { AddressSchema } from "shared/schemas";

export interface MessageAndError {
  message?: string;
  error?: string | ValidationError[];
}

export interface AddressResponse extends MessageAndError {
  data?: AddressSchema[];
}
export interface CreateAddressResponse extends MessageAndError {
  data?: AddressSchema;
}

export interface DefaultAddressResponse extends MessageAndError {
  data?: AddressSchema;
}

// Body
export interface CreateAddressBody {
  recipientName: string;
  streetAddress: string;
  addressLine2?: string;
  city: string;
  stateProvince: string;
  postalCode: number;
  country: string;
  deliveryInstructions: string;
  phoneNumber: string;
  addressLabel: string;
  isDefault: boolean;
}

// Params
export interface AddressParams {}
