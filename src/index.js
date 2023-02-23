export default {
  async fetch(request, env, ctx) {
    try {
      // Set request details
      const xrealip = request.headers.get("x-real-ip");
      const { country: countryCode, city, timezone } = request.cf;

      // GET Current Weather Data
      let resp = await fetch(
        `https://api.weatherapi.com/v1/current.json?key=${env.WEATHER_API_KEY}&q=${city}&aqi=no`
      );
      const data = await resp.json();
      const { country: countryName, localtime } = data.location;
      const { condition, temp_c, temp_f, wind_mph, wind_kph } = data.current;

      const weather = {
        countryCode: countryCode,
        countryName: countryName,
        city: city,
        condition: condition,
        temp_c: temp_c,
        temp_f: temp_f,
        wind_mph: wind_mph,
        wind_kph: wind_kph,
        timezone: timezone,
        localtime: localtime,
        xrealip: xrealip,
      };

      // Construct the response
      return new Response(JSON.stringify({ success: true, message: weather }), {
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
      });
    } catch (error) {
      console.log(error.message);
      return new Response(
        JSON.stringify({ success: false, message: error.message }),
        {
          status: 500,
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
          },
        }
      );
    }
  },
};
