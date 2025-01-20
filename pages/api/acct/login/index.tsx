import axios, { AxiosError } from "axios";
import { NextApiRequest, NextApiResponse } from "next";
import Cors from 'cors';

// CORS 미들웨어 초기화
const cors = Cors({
  methods: ['POST', 'GET', 'HEAD', 'OPTIONS'],
  credentials: true,
  origin: '*'
});

// CORS 미들웨어를 실행하기 위한 헬퍼 함수
function runMiddleware(req: NextApiRequest, res: NextApiResponse, fn: Function) {
  return new Promise((resolve, reject) => {
    fn(req, res, (result: any) => {
      if (result instanceof Error) {
        return reject(result);
      }
      return resolve(result);
    });
  });
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  // CORS 미들웨어 실행
  await runMiddleware(req, res, cors);

  // OPTIONS 요청에 대한 처리
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

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
    try {
      const response = await axios.post(
        `http://ec2-3-34-40-99.ap-northeast-2.compute.amazonaws.com/auth/signin`,
        req.body,
        {
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          }
        }
      );
      res.status(200).json(response.data);
    } catch (error: unknown) {
      if (error instanceof AxiosError) {
        console.error('Login error:', error.response?.data);
        res
          .status(error.response?.status || 500)
          .json({ 
            message: error.response?.data?.message || "Error fetching data",
            error: error.response?.data 
          });
      } else {
        res.status(500).json({ message: "Unknown error occurred" });
      }
    }
  } else {
    res.setHeader("Allow", ["GET", "POST", "OPTIONS"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
