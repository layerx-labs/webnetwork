import {join, resolve} from "node:path";
import {readFileSync} from "node:fs";
import Handlebars from "handlebars";

export class Template {
  constructor(readonly basePath: string) {
  }

  getFilePath(file: string) {
    return this.basePath.concat(file);
  }

  getHtmlOf(path: string) {
    const resolved = resolve(join(process.cwd(), this.getFilePath(path)))
    return readFileSync(resolved, "utf-8");
  }

  registerPartials() {
    Handlebars.registerPartial("styles", Handlebars.compile(this.getHtmlOf("partials/styles.hbs")));
    Handlebars.registerPartial("logo", Handlebars.compile(this.getHtmlOf("partials/logo.hbs")));
    Handlebars.registerPartial("appLinks", Handlebars.compile(this.getHtmlOf("partials/links.hbs")));
    Handlebars.registerPartial("headLinks", Handlebars.compile(this.getHtmlOf("partials/head.hbs")));
    Handlebars.registerPartial("avatar", Handlebars.compile(this.getHtmlOf("partials/avatar.hbs")));
  }

  compile(...args: any): string {
    return ""
  };
}