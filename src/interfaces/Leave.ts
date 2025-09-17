// export type Leave = {
//   employeeId: string;
//   startDate: string;
//   endDate: string;
//   leaveType: string;
//   reason: string;
//   attachmentUrl: string;
//   status: string;
//   type: string;
//   day: string;
//   leaveCount: number;
//   date: string;
//   _id: string;
//   dateEnd: string;

// };
export type Leave = {
  employeeId: string;
  avatar: string;
  name: string;
  startDate: string;
  endDate: string;
  leaveType: string;
  reason: string;
  attachmentUrl: string;
  status: string;
  type: string;
  day: string;
  leaveCount: number;
  date: string;
  _id: string;
  dateEnd: string;
  conversationId: string;

};

export type CreateLeaveFormData = {
  startDate: Date;
  endDate: Date;
  leaveType: string;
  reason: string;
  attachment: string;
};

export type EditLeavesFormData = {

  sick: number;
  casual: number;
  annual: number;
};
