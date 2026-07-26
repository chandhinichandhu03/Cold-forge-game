using System;
using UnityEngine;

namespace GAMETHON.Engine
{
    [RequireComponent(typeof(CharacterController))]
    public class PlayerController : MonoBehaviour
    {
        [Header("Movement Settings")]
        public float walkSpeed = 5.0f;
        public float sprintSpeed = 9.0f;
        public float jumpHeight = 2.0f;
        public float gravity = -19.62f;

        [Header("Parkour & IK")]
        public bool canParkour = true;
        public bool isVaulting = false;

        private CharacterController controller;
        private Vector3 velocity;
        private bool isGrounded;

        private void Start()
        {
            controller = GetComponent<CharacterController>();
        }

        private void Update()
        {
            HandleMovement();
        }

        private void HandleMovement()
        {
            isGrounded = controller.isGrounded;
            if (isGrounded && velocity.y < 0)
            {
                velocity.y = -2f;
            }

            float moveX = Input.GetAxis("Horizontal");
            float moveZ = Input.GetAxis("Vertical");

            bool isSprinting = Input.GetKey(KeyCode.LeftShift);
            float currentSpeed = isSprinting ? sprintSpeed : walkSpeed;

            Vector3 move = transform.right * moveX + transform.forward * moveZ;
            controller.Move(move * currentSpeed * Time.deltaTime);

            if (Input.GetButtonDown("Jump") && isGrounded)
            {
                velocity.y = Mathf.Sqrt(jumpHeight * -2f * gravity);
            }

            velocity.y += gravity * Time.deltaTime;
            controller.Move(velocity * Time.deltaTime);
        }
    }
}
