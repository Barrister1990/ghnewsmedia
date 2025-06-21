
import React from 'react';
import { Author } from '../types/news';

interface AuthorBioProps {
  author: Author;
}

const AuthorBio: React.FC<AuthorBioProps> = ({ author }) => {
  return (
    <div className="bg-white rounded-xl p-6 mb-12 shadow-sm">
      <div className="flex items-start space-x-4">
        <img
          src={author.avatar}
          alt={author.name}
          className="w-16 h-16 rounded-full object-cover"
        />
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900 mb-1">
            {author.name}
          </h3>
          <p className="text-accent font-medium mb-2">{author.title}</p>
          <p className="text-gray-600 mb-3">{author.bio}</p>
          <div className="flex space-x-3">
            {author.social.twitter && (
              <a
                href={`https://twitter.com/${author.social.twitter.replace('@', '')}`}
                className="text-blue-500 hover:text-blue-600 text-sm"
              >
                Twitter
              </a>
            )}
            {author.social.facebook && (
              <a
                href={`https://facebook.com/${author.social.facebook}`}
                className="text-blue-600 hover:text-blue-700 text-sm"
              >
                Facebook
              </a>
            )}
            {author.social.linkedin && (
              <a
                href={`https://linkedin.com/in/${author.social.linkedin}`}
                className="text-blue-700 hover:text-blue-800 text-sm"
              >
                LinkedIn
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthorBio;
