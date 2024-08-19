export class ProjectModel {
  id: number;
  name: string;
  userId?: number;
  isDeleted: boolean;
  buildingId?: number;
  location?: string;
  roofWkt?: string;
  roofGeom?: any;
  roofArea?: number;
}
