import React, {  useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'

import Header from '../../components/Header/Header'
import Loading from '../../components/loading'
import * as Icons from '../../components/icons'
import Tweet from '../../components/Tweet/Tweet'
import TextTitle from '../../components/Text/title'
import TextBody from '../../components/Text/body'
import Follow from '../../components/Follow/Follow'
import Button from '../../components/Button/Button'
import Avatar from '../../components/Avatar/Avatar'
import ThemeButton from '../../components/ThemeButton/ThemeButton'

import { client } from '../../utils'

import './Profile.css'


function Profile() {

  const { handle } = useParams();
  const [profile, setProfile] = useState({});
  const [loading, setLoading] = useState(true);
  const [deadend, setDeadend] = useState(false);

  const [followersState, setFollowers] = useState(0);
  const incFollowers = () => setFollowers(followersState + 1);
  const decFollowers = () => setFollowers(followersState - 1);

  useEffect(() => {
    window.scrollTo(0, 0);
    client(`/api/user/${handle}`)
      .then((res) => {
        setLoading(false);
        setDeadend(false);
        setProfile(res.data);
      })
      .catch((err) => setDeadend(true));
  }, [handle]);

  if (!deadend && loading) {
    return (
      <div className="loading">
        <Loading />
      </div>
    )
  }

  if (deadend) {
    return (
      <div>Sorry, this page isn't available</div>
    );
  }
  return (
    <div className="profile-page">

      <Header border>
        <div className='profile-page__header--body'>
          <Button icon>
            <Icons.Options />
          </Button>
          <div style={{ marginLeft: '15px' }}>
         <TextTitle xbold>{profile.fullname ?? profile.username}</TextTitle>
            <TextBody gray>
              {profile?.posts?.length
                ? `${profile.posts.length} Tweets`
                : "No Tweets"}
            </TextBody>
          </div>
        </div>
      </Header>

      <div style={{ height: '200px', background: "var(--profile-top)" }}></div>

      <div className="profile-page__container">

        <div>
          <Avatar size="xlarge" border src={profile.avatar} />

          {profile._id === JSON.parse(localStorage.getItem('user')).id ? (
            <div>
              <ThemeButton
                primary
                href='/accounts/edit'
              >
                Edit Profile
            </ThemeButton>
            </div>
          ) : (
              <Follow
                isFollowing={profile?.isFollowing}
                incFollowers={incFollowers}
                decFollowers={decFollowers}
                userId={profile?._id}
              />
            )}
        </div>

        <div className="profile-page__detail">
          <TextTitle xbold>{profile.fullname ?? profile?.username}</TextTitle>
          <TextBody>@{profile?.username}</TextBody>
          <TextBody>{profile.createdAt}</TextBody>
          <div className='profile-page__detail--b'>
            <TextBody><span className='bold'>{profile?.following?.length}</span> following</TextBody>
            <TextBody><span className='bold'>{profile?.followers?.length}</span> followers</TextBody>
          </div>
        </div>

      </div>


      {profile?.posts && profile.posts.map((post) => (
        <Tweet key={post._id} post={post} pusername={profile?.username} />
      ))}


    </div>
  )
}

export default Profile
