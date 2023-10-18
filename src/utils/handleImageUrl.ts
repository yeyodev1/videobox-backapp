export function addPrefixUrl(url: string, prefix: string): string {
  // Divide URL in two sections: before "predix-images/" and after "predix-images/"
  const urlSections = url.split('/videbox-bucket/');

  // we should have two parts
  if (urlSections.length === 2) {
    // Combine sections and prefix
    return `${urlSections[0]}/videbox-bucket/${prefix}${urlSections[1]}`;
  } else {
    // In case the format do not meet the two section, original url is returned
    return url;
  }
}
