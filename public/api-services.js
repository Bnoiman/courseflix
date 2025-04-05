const API_BASE_URL = 'https://courseflix-fastapi.herokuapp.com/api';

export async function fetchCourses() {
  const res = await fetch(`${API_BASE_URL}/courses`);
  return await res.json();
}
