export class FilterUtils<T> {
  static filterByDate<T>(
    data: T[],
    dateGetter: (item: T) => Date,
    filterValue: string,
    selectedDateOption: string
  ): T[] {
    if (!filterValue) return data;

    const selectedDate = new Date(filterValue);
    if (isNaN(selectedDate.getTime())) return data;

    return data.filter(item => {
      const itemDate = dateGetter(item);
      if (selectedDateOption === 'before') {
        return itemDate < selectedDate;
      } else if (selectedDateOption === 'after') {
        return itemDate > selectedDate;
      }
      return true;
    });
  }

  static filterByProperty<T>(
    data: T[],
    propertyGetter: (item: T) => string,
    filterValue: string
  ): T[] {
    if (!filterValue) return data;
    return data.filter(item => propertyGetter(item) === filterValue);
  }
}
