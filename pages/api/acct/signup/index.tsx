import axios, { AxiosError } from "axios";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method === "GET") {
    // get 통신 parameter 세팅
    let getParamSetting = "?";
    // eslint-disable-next-line prefer-const
    for (let q of Object.entries(req.query)) {
      getParamSetting += q[0] + "=" + q[1] + "&";
    }
    getParamSetting = getParamSetting.slice(0, -1);
    //`${BASE_URL}${url}${getParamSetting}`
    try {
      const response = await axios.get(
        `http://ec2-3-34-40-99.ap-northeast-2.compute.amazonaws.com/festivals${getParamSetting}`,
        { headers: req.headers },
      );
      res.status(200).json(response.data);
    } catch (error: unknown) {
      if (error instanceof AxiosError) {
        res
          .status(error.response?.status || 500)
          .json({ message: "Error fetching data" });
      } else {
        res.status(500).json({ message: "Unknown error occurred" });
      }
    }
  } else if (req.method === "POST") {
    console.log(req.body);
    try {
      const response = await axios.post(
        `http://ec2-3-34-40-99.ap-northeast-2.compute.amazonaws.com/auth/signup`,
        req.body,
        { headers: req.headers },
      );
      res.status(200).json(response.data);
    } catch (error: unknown) {
      if (error instanceof AxiosError) {
        res
          .status(error.response?.status || 500)
          .json({ message: "Error fetching data" });
      } else {
        res.status(500).json({ message: "Unknown error occurred" });
      }
    }
  } else {
    res.setHeader("Allow", ["GET"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
