import React, { useContext, useEffect, useState } from "react";
import { client } from "../../utils";
import ThemeButton from '../ThemeButton/ThemeButton'
import { useLocation as locations } from "react-router-dom";
import { FeedContext } from "../../context/FeedContext";

const Follow = ({ nobtn, isFollowing, incFollowers, decFollowers, userId, username }) => {
    let router = locations();
    const { feed, setFeed, setWhoFollow } = useContext(FeedContext);

    const [followingState, setFollowingState] = useState(isFollowing);

    useEffect(
        () => setFollowingState(isFollowing),
        [isFollowing]);

    const handleFollow = () => {
        const body = {
            user:JSON.parse(localStorage.getItem('user'))
        }
        if (followingState) {
            setFollowingState(false);
            if (decFollowers) {
                decFollowers();
            }
            client(`/api/user/${userId}/follow`,{body});
        } else {
            setFollowingState(true);
            if (incFollowers) {
                incFollowers();
            }
            client(`/api/user/${userId}/follow`,{body});

            //
            if (router.pathname === '/' && username) {
                client(`/users/${username}`)
                    .then((res) => {
                        setFeed([...res.data.posts, ...feed]);
                    })
                    .catch((err) => console.log(err));
            }
        }


        // update follow and following
        setTimeout(() => {
            client("/users")
                .then((response) => {
                    setWhoFollow(response.data.filter((user) => !user.isFollowing));
                });
        }, 2500);


    };

    if (followingState) {
        return (
            <>
                {nobtn ? (
                    <span
                        style={{ color: "#262626" }}
                        className="pointer"
                        onClick={() => handleFollow()}
                    >
                        Following
                    </span>
                ) : (
                        <ThemeButton size='medium' primary onClick={() => handleFollow()}>Following</ThemeButton>
                    )}
            </>
        );
    } else {
        return (
            <>
                {nobtn ? (
                    <span className="pointer" onClick={() => handleFollow()}>
                        Follow
                    </span>
                ) : (
                        <ThemeButton size='medium' onClick={() => handleFollow()}>Follow</ThemeButton>
                    )}
            </>
        );
    }
};

export default Follow;