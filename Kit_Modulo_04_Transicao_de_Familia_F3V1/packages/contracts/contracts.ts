export type ReleaseState='diagnostic_only'|'recovery_only_not_f3';
export interface SourceEntry{path:string;bytes:number;sha256:string;}
export interface PrivateJob{schema:'atelie-private-job/1';inventory:SourceEntry[];containsSourceContents:false;publicationAuthorized:false;approval:{planHash:string;kind:'local_acknowledgement_not_signature';scope:'private_source_recovery_only'};plan:unknown;}
