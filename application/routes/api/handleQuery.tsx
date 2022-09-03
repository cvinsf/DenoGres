import { Handlers, HandlerContext } from "$fresh/server.ts";
import { writeQueryText } from "../../utils/fileTextWriters.ts";

export const handler: Handlers = {
  async POST(req: Request, ctx: HandlerContext): Promise<Response> {

    const stringify = (obj: object): string => {
      return JSON.stringify(
        obj,
        (key: string, value: any): void => typeof value === "bigint" ? value.toString() : value,
      );
    };

    // console.log("In the handler");
    //TODO: obtain uri from user input
    const uri: string = 'postgres://fzggghbk:yuXc_N9fnsXb-g8HFEH_ujg5JB5O4urH@heffalump.db.elephantsql.com/fzggghbk';
    const queryStr: string = await req.json();
    const str: string = writeQueryText(uri, queryStr);

    const writePath: string = './application/data/query.ts';
    Deno.writeTextFileSync(writePath, str);
    const importPath: string = '../../data/query.ts';
    let funcToRun = await import(importPath);
    // console.log(funcToRun.default);
    let queryResult: object[] = await funcToRun.default();
    console.log(queryResult);
    return new Response(stringify(queryResult));
  },
};
// export const handler: Handlers = {
//   async POST(_, ctx) {
//     console.log("In the handler");

//     // await Deno.writeTextFile(path, str, { append: false });

//     const getResult = async (): Promise<any> => {
//       const str = `
//       import * as denogres from './models/model.ts';\n
//       export default async (): Promise<unknown[]> => {
//         const result = await denogres.Species.select('*').query();
//         return result;
//       };`;

//       const writePath = "./function.ts";
//       await Deno.writeTextFile(writePath, str, { append: false });
//       const importPath = "../../../function.ts";
//       const funcToRun = await import(importPath);
//       return funcToRun.default();
//     };

//     const queryResult = await getResult();

//     // function to stringify where field is bigint
//     const stringify = (obj: object): string => {
//       return JSON.stringify(
//         obj,
//         (key, value) => typeof value === "bigint" ? value.toString() : value,
//       );
//     };

//     const response = new Response(stringify(queryResult), {
//       status: 200,
//       headers: {
//         "content-type": "application/json",
//       },
//     });
//     return response;
//   },
// };
