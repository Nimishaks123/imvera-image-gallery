export interface IBaseRepository<T, TCreate = Omit<T, "id" | "createdAt" | "updatedAt">> {
  findById(id: string): Promise<T | null>;
  create(data: TCreate): Promise<T>;
  update(entity: T): Promise<T>;
  delete(id: string): Promise<void>;
}
