export default function currencyFormatter(formatNumber: number) {
  let userLanguage = localStorage.getItem("isVN_language");
  if (userLanguage && userLanguage === "false") {
    return new Intl.NumberFormat("ja-JP", {
      style: "currency",
      currency: "JPY",
    }).format(formatNumber) as any;
  } else {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(formatNumber) as any;
  }
}

export function isAlphabetic(balance: string) {
  let noCurrencyString = balance.replace("₫", "");
  let noSpaceString = noCurrencyString.replace(/\s+/g, "");
  let noDotString = noSpaceString.replace(".", "");
  let stringArray = noDotString.split("");

  for (let i = 0; i < stringArray.length; i++) {
    const code = stringArray[i].charCodeAt(0);
    if ((code >= 65 && code <= 90) || (code >= 97 && code <= 122)) {
      return true;
    }
  }
  return false;
}

function extractDigits(string: string): string {
  return string.replace(/\D/g, "");
}

function trimLeadingZero(string: string): string {
  return string.startsWith("0") ? string.slice(1) : string;
}

function adjustForBalanceInputValue(
  string: string,
  balanceInputValueRef: string
): string {
  return string === balanceInputValueRef ? string.slice(0, -4) : string;
}

function truncateToMaxLength(string: string, maxLength: number): string {
  return string.length > maxLength ? string.substring(0, maxLength) : string;
}

function removeTripleZero(string: string): string {
  return string.replace("000", "");
}
export function convertToCurrency(
  balance: string,
  balanceInputValueRef: string
) {
  let userLanguage = localStorage.getItem("isVN_language");
  const parsedDigitalCharacters = extractDigits(balance);

  let trimmedCharacters = trimLeadingZero(parsedDigitalCharacters);
  if (trimmedCharacters.length === 2 && balanceInputValueRef === "0") {
    trimmedCharacters = parsedDigitalCharacters.slice(0, -1);
  }
  const adjustedCharacters = adjustForBalanceInputValue(
    trimmedCharacters,
    balanceInputValueRef
  );
  const limitedCharacters = truncateToMaxLength(adjustedCharacters, 9);
  let cleanedCharacters;
  if (userLanguage && userLanguage === "false") {
    cleanedCharacters = limitedCharacters;
  } else {
    cleanedCharacters = removeTripleZero(limitedCharacters);
  }

  const parsedCurrency = parseInt(cleanedCharacters);

  // Handle potential parsing errors with fallback
  const currency = parsedCurrency || 0;

  //Check type money

  if (userLanguage && userLanguage === "false") {
    return currency;
  } else {
    return currency * 1000;
  }
}
