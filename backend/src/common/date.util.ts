export function isSameDay(date: Date, reference: Date = new Date()): boolean {
    return (
        date.getFullYear() === reference.getFullYear() &&
        date.getMonth() === reference.getMonth() &&
        date.getDate() === reference.getDate()
    );
}