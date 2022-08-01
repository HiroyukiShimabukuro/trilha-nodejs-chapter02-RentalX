import fs from 'fs';
import { parse as csvParse } from 'csv-parse';
import { ICategoriesRepository } from '../../repositories/ICategoriesRepository';

interface IImportCategory{
    name: string;
    description: string;
}

class ImportCategoryUseCase{
    constructor(private categoriesRepositories: ICategoriesRepository){}

    loadCategories(file: Express.Multer.File): Promise<IImportCategory[]>{
        return new Promise((resolve ,reject) => {
            const categories : IImportCategory[] = [];
            const stream =  fs.createReadStream(file.path);
            
            const parseFile = csvParse();

            stream.pipe(parseFile);

            parseFile.on("data", async (line) => {
                const [name, description] = line;

                categories.push({
                    name,
                    description,
                })
            })
            .on("end", () => {
                return resolve(categories);
            })
            .on("error", (err)=> {
                return reject(err);
            });
        })
    }

    async execute(file: Express.Multer.File): Promise<void>{
        const categories = await this.loadCategories(file);
        console.log(categories);
    }
}

export { ImportCategoryUseCase }