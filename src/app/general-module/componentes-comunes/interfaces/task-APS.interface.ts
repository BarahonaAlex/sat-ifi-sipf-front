export interface TaskFields {
    fields: Object,
    processDefinitionKey: string,
    taskDefinitionKey: string
}

export interface TaskNext {
    assignee?: {
      email: string,
      externalId: string,
      firstName: string,
      id: string,
      lastName: string
    },
    endDate: string,
    name: string,
    processDefinitionKey: string,
    taskDefinitionKey: string,
    taskIdEnc: string
  }