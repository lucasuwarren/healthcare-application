import { IFilterableSearchOption } from '../data-entry/filterable-search/filterable-search.component';

/**
 * Easier to figure out merging.
 */
export interface IMergeable {
  mergeable: (other: IMergeable) => boolean;
  merge: (other: IMergeable) => void;
}

export const MergeProperties = (property1: any, property2: any): any => {
  if (typeof property1 !== typeof property2) {
    console.log(property1 + ' and ' + property2 + ' have a type mismatch, since ' + typeof property1 + ' is not ' + typeof property2);
    return property1;
  }

  // Merge arrays.
  if (property1 instanceof Array) {
    const addToArray = (toAdd: any) => {
      for (const value of mergedArray) {
        if (value === toAdd) {
          return;
        }
      }
      mergedArray.push(toAdd);
    };
    const mergedArray = Array.from(property1);
    for (const value of property2) {
      addToArray(value);
    }
  }

  if (property1) {
    if (property2) {
      if (property1 !== property1)  {
        console.log('Conflicting values between ' + property1 + ' and ' + property2);
      }
      return property1;
    } else {
      return property1;
    }
  } else {
    return property2;
  }
};

/**
 * The gene class provides a quick and easy way to obtain gene names, various IDs, and so on from a
 * variety of databases.  Eventually this class will be made FHIR compliant to speed up FHIR bundle
 * conversion.
 */
export class Gene implements IMergeable {
  constructor (_hugo_symbol: string, _name: string, _score: number, _entrez_id: number) {
    this.hugo_symbol = _hugo_symbol;
    this.name = _name;
    this.score = _score;
    this.entrez_id = _entrez_id;
  }

  // Class properties
  hugo_symbol: string;
  name: string;
  score: number;
  entrez_id: number;

  mergeable = (other: Gene) => {
    if (this.hugo_symbol === '' || this.name === '') {
      return false;
    }
    return this.hugo_symbol === other.hugo_symbol || this.name === other.name;
  }

  // Merges another gene into this gene (overwriting properties if the property of one is undefined).
  merge = (other: Gene) => {
    this.entrez_id = MergeProperties(this.entrez_id, other.entrez_id);
    this.hugo_symbol = MergeProperties(this.hugo_symbol, other.hugo_symbol);
    this.score = MergeProperties(this.score, other.score);
  }
}

/**
 * Gene variants vary in their pathogenicity (danger to their host), and are important to consider
 * alongside the genes which they vary from.
 */
export class Variant implements IFilterableSearchOption, IMergeable {
  constructor(_origin: Gene, _variant_name: string, _hgvs_id: string, _score: number, _description: string, _somatic: boolean, _types: string[], _drugs: string[], _diseases: string[], _chromosome: string, _start: number, _end: number) {
    this.origin = _origin;
    this.variant_name = _variant_name;
    this.hgvs_id = _hgvs_id;
    this.score = _score;
    this.description = _description;
    this.somatic = _somatic;
    this.types = _types;
    this.drugs = _drugs;
    this.diseases = _diseases;
    this.chromosome = _chromosome;
    this.start = _start;
    this.end = _end;
  }

  origin: Gene;
  variant_name: string;
  hgvs_id: string;
  score: number;
  description: string;
  somatic: boolean;
  types: string[];
  drugs: string[];
  diseases: string[];
  chromosome: string;
  start: number;
  end: number;

  mergeable = (other: Variant) => {
    return this.origin.mergeable(other.origin) && this.hgvs_id === other.hgvs_id;
  }

  // Merges another gene into this gene (overwriting properties if the property of one is undefined).
  merge = (other: Variant) => {
    this.origin = MergeProperties(this.origin, other.origin);
    this.variant_name = MergeProperties(this.variant_name, other.variant_name);
    this.hgvs_id = MergeProperties(this.hgvs_id, other.hgvs_id);
    this.score = MergeProperties(this.score, other.score);
    this.description = MergeProperties(this.description, other.description);
    this.somatic = MergeProperties(this.somatic, other.somatic);
    this.types = MergeProperties(this.types, other.types);
    this.drugs = MergeProperties(this.drugs, other.drugs);
    this.diseases = MergeProperties(this.diseases, other.diseases);
    this.chromosome = MergeProperties(this.chromosome, other.chromosome);
    this.start = MergeProperties(this.start, other.start);
    this.end = MergeProperties(this.end, other.end);
  }

  optionName = () => {
    return this.origin.hugo_symbol + ' ' + this.variant_name + ' ' + this.origin.entrez_id + ' ' + this.hgvs_id;
  }

  getLocation = () => {
    return this.chromosome + ', ' + (this.start !== this.end ? 'Nucleotides ' +  this.start + ' to ' + this.end : 'Nucleotide ' + this.start);
  }
}
