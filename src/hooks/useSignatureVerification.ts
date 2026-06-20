import { useCallback, useMemo, useState } from 'react'
import { decodeLSB } from '../utils/steganography'

export type VerificationStatus =
  | { tone: 'info' | 'success' | 'error'; message: string }
  | null

interface UseSignatureVerificationOptions {
  onStatusChange?: (status: VerificationStatus) => void
}

export const useSignatureVerification = ({ onStatusChange }: UseSignatureVerificationOptions = {}) => {
  const [status, setStatus] = useState<VerificationStatus>(null)

  const updateStatus = useCallback((nextStatus: VerificationStatus) => {
    setStatus(nextStatus)
    onStatusChange?.(nextStatus)
  }, [onStatusChange])

  const verifyFile = useCallback(async (file: File | null | undefined) => {
    if (!file) {
      return
    }

    const objectUrl = URL.createObjectURL(file)

    try {
      const signature = await decodeLSB(objectUrl)

      updateStatus(
        signature
          ? {
              tone: 'success',
              message: `Signature found: "${signature}"`,
            }
          : {
              tone: 'info',
              message: 'No signature was found in the selected image.',
            },
      )
    } catch {
      updateStatus({
        tone: 'error',
        message: 'The embedded signature could not be read from the image.',
      })
    } finally {
      URL.revokeObjectURL(objectUrl)
    }
  }, [updateStatus])

  return useMemo(
    () => ({
      verifyFile,
      status,
      clearStatus: () => updateStatus(null),
      setStatus: updateStatus,
    }),
    [verifyFile, status, updateStatus],
  )
}
