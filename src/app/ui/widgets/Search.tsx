"use client";

import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { useState, useEffect, Fragment } from "react";
import searchByUsername from "@/app/actions/searchByUsername";
import getFriendsList from "@/app/actions/getFriendsList";
import { useAppDispatch } from "@/lib/state/hooks";
import { setSessionData } from "@/lib/state/features/session/sessionSlice";
import AddFriend from "./AddFriend";

interface IFoundUsers {
  id: number;
  username: string;
}

interface ISearch {
  id: number;
}

export default function Search({ id }: ISearch) {
  const [searchParams, setSearchParams] = useState<string>("");
  const [foundUsers, setFoundUsers] = useState<IFoundUsers[]>([]);
  const [friendsList, setFriendsList] = useState<number[] | undefined>([]); // list of friends of authenticated user
  const dispatch = useAppDispatch();

  // store session data in Rexux
  useEffect(() => {
    if (id) {
      dispatch(setSessionData(id));
    }
  }, []);

  useEffect(() => {

    const retrieveFriendsList = async () => {
      const result = await getFriendsList(id);
      setFriendsList(result);
    };

    retrieveFriendsList();
  }, []);

  useEffect(() => {
    const findMatchingUsers = async () => {
      const result = await searchByUsername(searchParams);
      setFoundUsers(result);
    };

    findMatchingUsers();
  }, [searchParams]);

  return (
    <>
      <div className="px-4 py-2">
        <Input
          value={searchParams}
          onChange={(e) => setSearchParams(e.target.value)}
          className="w-56 border-blue-500 border-1 z-100"
          type="text"
          placeholder="Search for players.."
        />
        <div>
          <ScrollArea
            className={`${searchParams.length > 0 ? "h-72 w-56 rounded-b-md mt-0.5 transition duration-300 border shadow-md" : "hidden"}`}
          >
            <div className="p-4 cursor-pointer">
              <h4 className="mb-4 text-sm font-medium">Players</h4>
              {foundUsers.map((user, index) => {
                return (
                  <Fragment key={index}>
                    <div className="text-sm font-bold flex justify-between items-center">
                      <span>{user.username}</span>

                      <AddFriend
                        friendsList={friendsList}
                        userId={id}
                        friendId={user.id}
                      />
                    </div>
                    <Separator className="my-2" />
                  </Fragment>
                );
              })}
            </div>
          </ScrollArea>
        </div>
      </div>
    </>
  );
}
