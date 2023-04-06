import dayjs from "dayjs";

export const generateEntryDocuID = () => {
  const randomString = Math.random().toString(36).substring(2, 6);
  const id = (
    randomString +
    "-" +
    Date.now().toString().substr(-6)
  ).toUpperCase();

  return id;
};

export const koDate = (dateStr) => {
  if (dateStr === undefined || dateStr === "") {
    return;
  }
  const today = dayjs();
  let date = dayjs(dateStr, ["M-D", "YYYY-M-D"], true);

  if (!date.isValid()) {
    return "";
  }

  // 입력받은 문자열이 '12-31' 형태인 경우에는 올해 연도를 자동으로 붙인다
  if (dateStr.length <= 6) {
    date = date.year(today.year());
  }

  return date.format("YYYY-MM-DD");
};

export const numberWithCommas = (x) => {
  if (x === undefined || x === "" || x === 0) {
    return;
  }
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};
