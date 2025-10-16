import axios from "axios";
export const callApi = (getOptions) => {
  try {
    return axios(getOptions);
  } catch (e) {
    return e.response;
  }
};

export const generateMonthlyDataArray = (monthYearString) => {
  const date = new Date(monthYearString);

  if (isNaN(date.getTime())) {
    console.error(
      `Error: Could not parse date from string "${monthYearString}". Returning empty array.`
    );
    return [];
  }

  // Set to 1st day of month
  date.setDate(1);

  const firstDayOfWeek = date.getDay();
  const year = date.getFullYear();
  const month = date.getMonth();
  const totalDaysInMonth = new Date(year, month + 1, 0).getDate();

  const daysArray = [];

  // Add leading nulls for alignment
  for (let i = 0; i < firstDayOfWeek; i++) {
    daysArray.push(null);
  }

  // Generate day objects
  for (let day = 1; day <= totalDaysInMonth; day++) {
    const currentDayDate = new Date(year, month, day);
    const currentDayOfWeek = currentDayDate.getDay();

    // Create full date string in YYYY-MM-DD format
    const fullDate = `${year}-${String(month + 1).padStart(2, "0")}-${String(
      day
    ).padStart(2, "0")}`;

    let status = null;
    if (currentDayOfWeek === 0 || currentDayOfWeek === 6) {
      status = "WEEKEND";
    }

    daysArray.push({
      date: day,
      fullDate,
      status,
    });
  }

  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  return {
    month: `${monthNames[month]} ${year}`,
    days: daysArray,
    totalWfoDays: 0,
  };
};


export const updateCalendarWithApiData=(calendarData, apiData) =>{
  if (!calendarData?.days || !Array.isArray(calendarData.days)) return calendarData;

  // Convert API response into a lookup for quick access
  const statusMap = apiData.reduce((map, item) => {
    const date = new Date(item.date);
    const day = date.getDate(); // Extract the day number (1–31)
    map[day] = item.status;
    return map;
  }, {});

  // Update calendar days with the corresponding status
  calendarData.days = calendarData.days.map((day) => {
    if (!day || !day.date) return day; // Skip null placeholders
    if (statusMap[day.date]) {
      return { ...day, status: statusMap[day.date] };
    }
    return day;
  });

  // Update total WFO days count
  calendarData.totalWfoDays = calendarData.days.filter(
    (d) => d && d.status === "WFO"
  ).length;

  return calendarData;
}
