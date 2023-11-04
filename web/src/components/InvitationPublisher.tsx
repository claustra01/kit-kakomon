import { useState } from "react";
import dayjs from "dayjs";
import { Select, MenuItem } from "@mui/material";

enum Expiry {
  EXPIRY_5M,
  EXPIRY_3H,
  EXPIRY_24H,
  EXPIRY_3D,
}

export default function InvitationPublisher({publisherId}: {publisherId: string}) {

  const [validCount, setValidCount] = useState<number>(1);
  const [expiry, setExpiry] = useState<Expiry>(Expiry.EXPIRY_24H);

  const calcExpiterAt = () => {
    switch(expiry) {
      case Expiry.EXPIRY_5M:
        return dayjs().add(5, 'm').format();
      case Expiry.EXPIRY_3H:
        return dayjs().add(3, 'h').format();
      case Expiry.EXPIRY_24H:
        return dayjs().add(1, 'd').format();
      case Expiry.EXPIRY_3D:
        return dayjs().add(3, 'd').format();
    }
  }

  const createInvitation = async () => {
    if (publisherId === '') {
      console.error('failed to get user data');
      return;
    }
    const expiredAt = calcExpiterAt();
    try {
      const response = await fetch(`/api/invitations`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          publisher: publisherId,
          valid_count: validCount,
          expired_at: expiredAt,
        }),
      });
      const data = await response.json();
      if (response.ok) {
        setValidCount(1);
        setExpiry(Expiry.EXPIRY_24H);
        alert('created!');
      } else {
        console.error(response.statusText, data.message);
      }
    } catch (error) {
      console.error(error);
    }

  }

  return(
    <>
      <div>
        <h1>Profile Setup</h1>
        <div>
          <Select
            id="valid-count-select"
            value={validCount}
            label="ValidCount"
            onChange={(e) => setValidCount(Number(e.target.value))}
          >
            <MenuItem value={1}>1</MenuItem>
            <MenuItem value={3}>3</MenuItem>
            <MenuItem value={10}>10</MenuItem>
          </Select>
        </div>
        <div>
          <Select
            id="expiry-select"
            value={expiry}
            label="Expiry"
            onChange={(e) => setExpiry(e.target.value as Expiry)}
          >
            <MenuItem value={Expiry.EXPIRY_5M}>5分</MenuItem>
            <MenuItem value={Expiry.EXPIRY_3H}>3時間</MenuItem>
            <MenuItem value={Expiry.EXPIRY_24H}>24時間</MenuItem>
            <MenuItem value={Expiry.EXPIRY_3D}>3日</MenuItem>
          </Select>
        </div>
        <button onClick={createInvitation}>Register</button>
      </div>
    </>
  );

}