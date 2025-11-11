export interface AddressSchema {
  address_id: number;
  user_id: number;
  recipient_name: string;
  street_address: string;
  address_line_2: string;
  city: string;
  state_province: string;
  postal_code: string;
  country: string;
  delivery_instructions: string;
  phone_number: string;
  address_label: string;
  is_default: boolean;
  created_at: string;
  updated_at: string;
}
