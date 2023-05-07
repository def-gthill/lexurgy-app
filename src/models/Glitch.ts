// When one resource points to another resource
// that doesn't exist.
export default interface Glitch {
  // The ID of the glitch itself
  id: string;
  languageId?: string;
  // What kind of resource is invalid
  // because it's pointing to something non-existent?
  dependentType: string;
  // Which resource is invalid?
  dependentId: string;
  // What part of the resource is invalid?
  // This is a list of property names and array indices that
  // let you navigate to the broken reference.
  dependentPartPath: [string | number][];

  // What kind of resource is missing?
  referentType: string;
  // Which resource is missing?
  referent: MissingReferent;
  // What part of the resource is invalid?
  // This is a list of property names and array indices that
  // let you navigate to the where the missing resource would be.
  // Empty if the entire resource is missing.
  referentPartPath: [string | number][];
}

export interface MissingReferent {
  // Do we have an ID for the missing resource?
  isId: boolean;
  // How we know which resource is being referenced.
  // This is the ID if one is available, otherwise
  // it's the matching key that's being used to search for
  // the resource.
  key: string;
}
