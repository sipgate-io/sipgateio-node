export interface SMSResponse {
  id: string;
  alias: string;
  callerId: string;
}

export interface SMSResponses {
  items: SMSResponse[];
}
