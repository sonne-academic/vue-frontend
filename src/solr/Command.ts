export default class Command {
  public method: string;
  public endpoint: string;
  public args: any;
  public params: any;
  public description: string;
  public documentation: string;
  constructor(method: string, endpoint: string, args: any, params: any, description: string, documentation: string) {
    this.method = method;
    this.endpoint = endpoint;
    this.args = args;
    this.params = params;
    this.description = description;
    this.documentation = documentation;
  }
}
