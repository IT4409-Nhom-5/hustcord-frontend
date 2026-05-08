import React from 'react';
import PageWrapper from '../components/layout/PageWrapper';
import ChatArea from '../components/channel/ChatArea';
import MemberList from '../components/user/MemberList';

const GuildPage: React.FC = () => {
  return (
    <PageWrapper>
      <div className="flex h-full w-full">
        <ChatArea />
        <MemberList />
      </div>
    </PageWrapper>
  );
};

export default GuildPage;
