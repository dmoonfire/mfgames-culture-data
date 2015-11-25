declare module "strip-json-comments" {
    interface StripJsonOptions {
        whitespace?: boolean;
    }

    function stripJsonComments(input: string, opts?: StripJsonOptions): string;
    export = stripJsonComments;
}
