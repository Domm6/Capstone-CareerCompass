import config from "./config";

class ApiService {
  // fetch a mentee's data
  async fetchMenteeData(userId) {
    try {
      const response = await fetch(`${config.apiBaseUrl}/mentees/${userId}`);
      if (!response.ok) {
        throw new Error("Failed to fetch mentee data");
      }
      const data = await response.json();
      return data.mentee;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  // fetch a mentee's data using menteeId instead of user id
  async fetchMenteeDataMenteeId(userId) {
    try {
      const response = await fetch(
        `${config.apiBaseUrl}/mentees/menteeId/${userId}`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch mentee data");
      }
      const data = await response.json();
      return data.mentee;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  // fetch a menotrs data
  async fetchMentorData(userId) {
    try {
      const response = await fetch(`${config.apiBaseUrl}/mentors/${userId}`);
      if (!response.ok) {
        throw new Error("Failed to fetch mentor data");
      }
      const data = await response.json();
      return data.mentor;
    } catch (error) {
      throw new Error(error.message);
    }
  }
}

export default ApiService;
