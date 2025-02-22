import type { Company } from "../companies/model.company.mts";
import type { Service } from "../lib/service.mts";

export const buildFsSaveCompany =
  (
    companiesTableName: string,
    read: Service<[tableName: string], string>,
    save: Service<[tableName: string, data: string], void>
  ) =>
  async (company: Company): Promise<void> => {
    const fileName = companiesTableName + ".json";
    const savedCompanies = await read(fileName);
    const companies = JSON.parse(savedCompanies || "[]");
    const data = JSON.stringify([...companies, company]);
    await save(fileName, data);
  };
