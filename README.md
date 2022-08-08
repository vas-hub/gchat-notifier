# GChat notifier


## Description
Github Action to notify of builds' results via Google Chat.

## Inputs
### `project-name`
**Required** The name of the project we're building.

### `service-account-email`
**Required** The email of the dedicated GCP account used to read Google Sheets.

### `service-account-private-key`
**Required** The private key of the dedicated GCP account used to read Google Sheets.

### `sheet-id`
**Required** The id of the Googls Sheets document where the mappings between projects names and chatrooms are stored.

## Usage
```yaml
steps:
  - name: Notify
    uses: vas-hub/gchat-notifier
    with:
    service-account-email: ${{ secrets.NOITIFIER_SERVICE_ACCOUNT_EMAIL }}
    service-account-private-key: ${{ secrets.NOTIFIER_SERVICE_ACCOUNT_PRIVATE_KEY }}
    sheet-id: ${{ secrets.NOTIFIER_SHEET_ID }}
    project-name: 'my-project'
```
