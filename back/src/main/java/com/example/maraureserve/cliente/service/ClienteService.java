package com.example.maraureserve.cliente.service;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.maraureserve.cliente.dto.ClienteRequest;
import com.example.maraureserve.cliente.dto.ClienteResponse;
import com.example.maraureserve.cliente.model.Cliente;
import com.example.maraureserve.cliente.repository.ClienteRepository;
import com.example.maraureserve.common.exception.BusinessException;
import com.example.maraureserve.common.exception.ResourceNotFoundException;

@Service
public class ClienteService {

    private final ClienteRepository clienteRepository;

    public ClienteService(ClienteRepository clienteRepository) {
        this.clienteRepository = clienteRepository;
    }

    @Transactional(readOnly = true)
    public List<ClienteResponse> listar() {
        return clienteRepository.findAll().stream()
                .map(ClienteResponse::fromEntity)
                .toList();
    }

    @Transactional(readOnly = true)
    public ClienteResponse buscarPorId(Long id) {
        return ClienteResponse.fromEntity(buscarEntidade(id));
    }

    @Transactional
    public ClienteResponse criar(ClienteRequest request) {
        validarCpfUnico(request.cpf(), null);
        Cliente cliente = new Cliente();
        preencherCampos(cliente, request);
        return ClienteResponse.fromEntity(clienteRepository.save(cliente));
    }

    @Transactional
    public ClienteResponse atualizar(Long id, ClienteRequest request) {
        Cliente cliente = buscarEntidade(id);
        validarCpfUnico(request.cpf(), id);
        preencherCampos(cliente, request);
        return ClienteResponse.fromEntity(clienteRepository.save(cliente));
    }

    @Transactional
    public void excluir(Long id) {
        Cliente cliente = buscarEntidade(id);
        if (!cliente.getAlugueis().isEmpty()) {
            throw new BusinessException("Não é possível excluir um cliente que já possui aluguéis vinculados.");
        }
        clienteRepository.delete(cliente);
    }

    @Transactional(readOnly = true)
    public Cliente buscarEntidade(Long id) {
        return clienteRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Cliente", id));
    }

    private void preencherCampos(Cliente cliente, ClienteRequest request) {
        cliente.setNome(request.nome());
        cliente.setCpf(request.cpf());
        cliente.setEndereco(request.endereco());
        cliente.setTelefone(request.telefone());
        cliente.setEmail(request.email());
    }

    private void validarCpfUnico(String cpf, Long clienteIdAtual) {
        clienteRepository.findByCpf(cpf)
                .filter(cliente -> !cliente.getId().equals(clienteIdAtual))
                .ifPresent(cliente -> {
                    throw new BusinessException("Já existe um cliente cadastrado com este CPF.");
                });
    }
}
