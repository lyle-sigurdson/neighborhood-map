/*jshint browser: true */

export default function (venue) {
    return `
        <h3>${venue.name}</h3>
        <ul class="list-bare">
          ${venue.location && venue.location.address ? `<li>${venue.location.address}</li>` : ''}
          ${venue.contact && venue.contact.formattedPhone ? `<li>${venue.contact.formattedPhone}</li>` : ''}
          ${venue.contact && venue.contact.twitter ? `<li>@${venue.contact.twitter}</li>` : ''}
          ${venue.contact && venue.contact.facebook ? `<li>${venue.contact.facebook}</li>` : ''}
          ${venue.contact && venue.contact.facebookName ? `<li>${venue.contact.facebookName}</li>` : ''}
          ${venue.contact && venue.contact.facebookUsername ? `<li>${venue.contact.facebookUsername}</li>` : ''}
        </ul>
    `;
}
