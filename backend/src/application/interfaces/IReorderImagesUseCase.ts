export interface IReorderImagesUseCase {
  execute(userId: string, imageIds: string[]): Promise<void>;
}
