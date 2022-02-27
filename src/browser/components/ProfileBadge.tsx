import React, { FC, useState } from "react";
import tw, { styled } from "twin.macro";

import { useAccessToken } from "../helpers/hooks";

import AboutModal from "./modals/AboutModal";
import SettingsModal from "./modals/SettingsModal";

import ContextMenu from "./ContextMenu";
import Image from "./Image";

const Wrapper = styled.button`
  ${tw`bg-black flex-none h-10 overflow-hidden relative rounded-full w-10`}
`;

const ProfileImage = styled(Image)`
  ${tw`h-full w-full`}
`;

interface ProfileBadgeProps {
  className?: string;
  user: any;
}

const ProfileBadge: FC<ProfileBadgeProps> = (props) => {
  const [, store] = useAccessToken();

  const [isSettingsOpen, setSettingsOpen] = useState(false);
  const [isAboutOpen, setAboutOpen] = useState(false);

  return (
    <>
      <ContextMenu
        placement="right-end"
        menu={{
          items: [
            {
              type: "link",
              children: "Settings",
              onClick() {
                setSettingsOpen(true);
              },
            },
            {
              type: "link",
              children: "About & Help",
              onClick() {
                setAboutOpen(true);
              },
            },
            {
              type: "separator",
            },
            {
              type: "link",
              children: "Logout",
              onClick() {
                store.set(null);
              },
            },
          ],
        }}
      >
        {(ref) => (
          <Wrapper className={props.className} ref={ref}>
            {props.user && <ProfileImage src={props.user.profile_image_url} />}
          </Wrapper>
        )}
      </ContextMenu>

      <SettingsModal isOpen={isSettingsOpen} onClose={() => setSettingsOpen(false)} />
      <AboutModal isOpen={isAboutOpen} onClose={() => setAboutOpen(false)} />
    </>
  );
};

export default ProfileBadge;
