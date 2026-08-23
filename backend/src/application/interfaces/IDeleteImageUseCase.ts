export interface IDeleteImageUseCase {
  execute(id: string, userId: string): Promise<void>;
}
