import {
  bracketsRegexp,
  packageNameRegexp,
  packageRequirementsRegexp,
  quotedStringRegexp,
} from "./common";
import { Dependency } from "./types";

export function isDependency(line: string): boolean {
  return packageNameRegexp.test(line) && packageRequirementsRegexp.test(line);
}

function normalize(name: string): string {
  if (bracketsRegexp.test(name)) {
    return name.split("[")[0];
  }
  return name;
}

export function hasQuotedString(line: string): boolean {
  return quotedStringRegexp.test(line);
}

export function extractQuotedString(line: string): string {
  const matches = quotedStringRegexp.exec(line);
  if (matches && matches.length === 2) {
    return matches[1];
  }
  return line;
}

export function extractDependency(line: string): Dependency | undefined {
  line = line.trim();

  if (hasQuotedString(line)) {
    line = extractQuotedString(line);
  }

  if (!isDependency(line)) {
    return undefined;
  }

  const packageName = packageNameRegexp.exec(line);
  const packageRequirements = packageRequirementsRegexp.exec(line);

  if (packageName === null || packageName.length !== 3) {
    return undefined;
  }

  if (packageRequirements === null || packageRequirements.length !== 2) {
    return undefined;
  }

  const name = normalize(packageName[1]);
  const requirements = packageRequirements[1];

  return { name, requirements };
}
