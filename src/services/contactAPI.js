import api from '../utils/api';

const contactAPI = {
  /**
   * Submit contact form
   * @param {Object} data - Contact form data
   * @param {string} data.name - Name of the person
   * @param {string} data.email - Email address
   * @param {string} data.subject - Subject of the message
   * @param {string} data.message - Message content
   * @returns {Promise} API response
   */
  async submit(data) {
    const response = await api.post('/contact', data);
    return response.data;
  },
};

export default contactAPI;
